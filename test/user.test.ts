import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../src/data-source";
import { Team } from "../src/entity/Team";
import { User } from "../src/entity/User";

describe("영속성 테스트", () => {
  let DataSource: DataSource;
  let UserRepository: Repository<User>;
  let TeamRepository: Repository<Team>;

  beforeAll(async () => {
    DataSource = await AppDataSource.initialize();
    UserRepository = DataSource.getRepository(User);
    TeamRepository = DataSource.getRepository(Team);
  });

  afterAll(async () => {
    DataSource.destroy();
  });

  beforeEach(() => {
    TeamRepository.clear();
    UserRepository.clear();
  });
  describe("하나의 엔티티 대상 테스트", () => {
    test("새로운 엔티티 생성 후, save시 기존 엔티티가 업데이트 되는가", async () => {
      // given
      const user = new User();
      user.name = "myeongil";
      user.age = 28;

      // when
      await UserRepository.save(user);

      // then
      expect(user.id).toBeDefined();
    });

    test("새로운 엔티티 생성 후, insert시 기존 엔티티가 업데이트 되는가", async () => {
      // given
      const user = new User();
      user.name = "myeongil";
      user.age = 28;

      // when
      await UserRepository.insert(user);

      // then
      expect(user.id).toBeDefined();
    });

    test("다른 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가", async () => {
      // given
      const user = new User();
      user.name = "test";
      user.age = 12;

      // when
      await UserRepository.save(user);

      const savedUser = await UserRepository.findOneBy({ id: user.id });

      // then
      expect(user === savedUser).toBe(false);
    });

    test("같은 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가", async () => {
      // given
      const user = new User();
      user.name = "test";
      user.age = 12;

      // when
      // 같은 트랜잭션에서 save후 select하더라도 새롭게 쿼리가 나감.
      const qr = DataSource.createQueryRunner();

      await qr.startTransaction();

      await qr.manager.withRepository(UserRepository).save(user);
      const savedUser = await qr.manager
        .withRepository(UserRepository)
        .findOneBy({ id: 1 });

      await qr.commitTransaction();

      // then
      expect(user === savedUser).toBe(false);
    });
  });

  describe("연관관계 관련 테스트", () => {
    test("연관된 객체 지연 조회후 재조회시, 두 객체는 서로 같은가", async () => {
      // given
      const team = new Team();
      team.name = "TEST";
      await TeamRepository.save(team);

      const user = new User();
      user.name = "test";
      user.age = 13;
      user.team = Promise.resolve(team);
      await UserRepository.save(user);

      const savedUser = await UserRepository.findOneBy({ id: user.id });

      // when
      const getUserTeam = await savedUser.team;
      const getUserTeam2 = await savedUser.team;

      // then
      expect(getUserTeam === getUserTeam2).toBe(true);
    });
  });
});
